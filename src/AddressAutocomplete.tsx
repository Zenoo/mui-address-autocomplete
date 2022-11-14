import { LocationOn } from '@mui/icons-material';
import { Autocomplete, AutocompleteChangeReason, AutocompleteProps, AutocompleteRenderInputParams, Box, Grid, TextField, Typography } from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash.throttle';
import React, { useCallback, useEffect, useMemo } from 'react';
import { AddressAutocompleteProps, AddressAutocompleteValue, PlaceType } from '../dist/AddressAutocomplete';

type AutocompleteServiceHolder = {
  current: google.maps.places.AutocompleteService | null
}
const autocompleteService: AutocompleteServiceHolder = { current: null };
type PlacesServiceHolder = {
  current: google.maps.places.PlacesService | null
}
const placesService: PlacesServiceHolder = { current: null };

/**
 * AddressAutocomplete Component
 */
const AddressAutocomplete = ({
  apiKey,
  fields = ['address_components', 'formatted_address'],
  label,
  onChange,
  value,
  requestOptions = {},
  ...rest
}: AddressAutocompleteProps) => {
  const loaded = React.useRef(false);
  const [addressOptions, setAddressOptions] = React.useState<readonly PlaceType[]>([]);
  const [addressValue, setAddressValue] = React.useState<AddressAutocompleteValue | null>(value);
  const [addressInputValue, setAddressInputValue] = React.useState('');

  // Update inner value when props value change
  useEffect(() => {
    setAddressValue(value);
  }, [value]);

  // Prefill fields if needed
  const actualFields = useMemo(() => {
    if(!fields.includes('address_components')) {
      fields.push('address_components');
    }
    if(!fields.includes('formatted_address')) {
      fields.push('formatted_address');
    }

    return fields;
  }, [fields]);

  // Options label
  const getOptionLabel = useCallback(
    (option: PlaceType) => (typeof option === 'string' ? option : option.description),
    []
  );

  // Autocomplete equals
  const isOptionEqualToValue = useCallback(
    (option: PlaceType, val: PlaceType) => option.place_id === val.place_id,
    []
  );

  // Empty filter
  const filterOptions = useCallback((x: PlaceType[]) => x, []);

  // Address selection
  const selectAddress = useCallback((event: React.SyntheticEvent<Element, Event>, newValue: PlaceType | null, reason: AutocompleteChangeReason) => {
    if (!placesService.current) {
      return;
    }
    setAddressOptions((previous) => (newValue ? [newValue, ...previous] : previous));
    if (newValue && newValue.place_id) {
      placesService.current.getDetails({ placeId: newValue.place_id, fields: actualFields }, (place: google.maps.places.PlaceResult | null) => {
        if (!place) {
          return;
        }
        const placeWithComponents: AddressAutocompleteValue = {
          ...place,
          structured_formatting: {
            main_text: place.formatted_address || '',
            secondary_text: place.name || '',
            main_text_matched_substrings: [{ offset: 0, length: place.formatted_address?.length || 0 }],
          },
          components: (place.address_components || []).reduce((acc, item) => {
            item.types.forEach((type) => {
              if (!acc[type]) {
                acc[type] = [];
              }
              acc[type].push({
                long_name: item.long_name,
                short_name: item.short_name
              });
            });
            return acc;
          }, {}),
          description: newValue.description,
          place_id: newValue.place_id
        };
        setAddressValue(placeWithComponents);
        onChange(event, placeWithComponents, reason);
      });
    } else {
      setAddressValue(null);
      onChange(event, null, reason);
    }
  }, [actualFields, onChange]);

  // Address input change
  const searchAddress = useCallback((_: React.SyntheticEvent<Element, Event>, newInputValue: string) => {
    setAddressInputValue(newInputValue);
  }, []);

  // Address input renderer
  const renderAddressInput = useCallback((params: AutocompleteRenderInputParams) => (
    <TextField {...params} fullWidth label={label} />
  ), [label]);

  // Options renderer
  const renderAddressOption = useCallback((props: React.HTMLAttributes<HTMLLIElement>, option: PlaceType) => {
    const {
      structured_formatting: {
        main_text_matched_substrings: matches
      }
    } = option;
    const parts = parse(
      option.structured_formatting.main_text,
      matches.map((match) => [match.offset, match.offset + match.length]),
    );

    return (
      <li {...props}>
        <Grid alignItems="center" container>
          <Grid item>
            <Box
              component={LocationOn}
              sx={{ mr: 2 }}
            />
          </Grid>
          <Grid item xs>
            {parts.map((part, index) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                style={{ fontWeight: part.highlight ? 700 : 400 }}
              >
                {part.text}
              </span>
            ))}

            <Typography variant="body2">
              {option.structured_formatting.secondary_text}
            </Typography>
          </Grid>
        </Grid>
      </li>
    );
  }, []);

  // Load Google Maps API script if not already loaded
  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      const script = document.createElement('script');

      script.setAttribute('async', '');
      script.setAttribute('id', 'google-maps');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      document.querySelector('head')?.appendChild(script);
    }

    loaded.current = true;
  }

  // Autocomplete predictions fetcher
  const fetch = useMemo(() => throttle((
    request: google.maps.places.AutocompletionRequest,
    callback: (a: google.maps.places.AutocompletePrediction[] | null, b: google.maps.places.PlacesServiceStatus) => void
  ) => {
    if (autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(request, callback);
    }
  }, 200), []);

  // Runs on input change
  useEffect(() => {
    // Lock worker
    let active = true;

    // Initialize Google Maps Autocomplete Service
    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    // Initialize Google Maps Places Service
    if (!placesService.current && window.google) {
      placesService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
    }
    // Stop execution if the service is not available
    if (!autocompleteService.current || !placesService.current) {
      return undefined;
    }

    // Hide options when input is empty
    if (addressInputValue === '') {
      setAddressOptions((prev) => {
        if (addressValue && !prev.find((o) => o.place_id === addressValue.place_id)){
          return [addressValue];
        }

        return [];
      });
      return undefined;
    }

    // Fetch autocomplete predictions
    fetch({
      ...requestOptions,
      input: addressInputValue,
    }, (results: google.maps.places.AutocompletePrediction[] | null) => {
      if (active) {
        let newOptions: PlaceType[] = [];

        // Include fetched predictions
        if (results) {
          newOptions = results;
        }

        if (addressValue) {
          const fetchedAddressValueIndex = newOptions.findIndex((o) => o.place_id === addressValue.place_id);
          // Include selected address if it is not in the predictions
          if (fetchedAddressValueIndex === -1) {
            newOptions = [addressValue, ...newOptions];
          } else {
            // Place selected addres at the top if it is in the predictions
            newOptions = [newOptions[fetchedAddressValueIndex], ...newOptions.slice(0, fetchedAddressValueIndex), ...newOptions.slice(fetchedAddressValueIndex + 1)];
          }
        }

        setAddressOptions(newOptions);
      }
    });

    return () => {
      // Unlock worker
      active = false;
    };
  }, [addressValue, addressInputValue, fetch]);

  return (
    <Autocomplete
      autoComplete
      filterOptions={filterOptions}
      filterSelectedOptions
      fullWidth
      getOptionLabel={getOptionLabel}
      includeInputInList
      isOptionEqualToValue={isOptionEqualToValue}
      onChange={selectAddress}
      onInputChange={searchAddress}
      options={addressOptions}
      renderInput={renderAddressInput}
      renderOption={renderAddressOption}
      value={addressValue}
      {...rest}
    />
  );
};

export default AddressAutocomplete;
