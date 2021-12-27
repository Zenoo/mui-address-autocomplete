import { LocationOn } from '@mui/icons-material';
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash.throttle';
import React, { useCallback, useEffect, useMemo } from 'react';

const autocompleteService = { current: null };
const placesService = { current: null };

/**
 * AddressAutocomplete component
 * @param {Object} props
 * @param {String} props.apiKey Google Maps API key
 * @param {String[]} props.fields List of fields to be returned from the API
 * @param {String} props.label  Label for the input
 * @param {Function} props.onChange  Change callback
 * @param {Object} props.value  Address value
 * @returns {React.ReactElement}
 */
const AddressAutocomplete = ({
  apiKey,
  fields,
  label,
  onChange,
  value,
  ...rest
}) => {
  const loaded = React.useRef(false);
  const [addressOptions, setAddressOptions] = React.useState([]);
  const [addressValue, setAddressValue] = React.useState(value);
  const [addressInputValue, setAddressInputValue] = React.useState('');

  // Update inner value when props value change
  useEffect(() => {
    setAddressValue(value);
  }, [value]);

  // Options label
  const getOptionLabel = useCallback((option) => (typeof option === 'string' ? option : option.description), []);

  // Autocomplete equals
  const isOptionEqualToValue = useCallback((option, value) => option.place_id === value.place_id, []);

  // Empty filter
  const filterOptions = useCallback((x) => x, []);

  // Address selection
  const selectAddress = useCallback((_, newValue) => {
    setAddressOptions((previous) => (newValue ? [newValue, ...previous] : previous));
    placesService.current.getDetails({ placeId: newValue.place_id, fields }, (place) => {
      const placeWithComponents = {
        ...place,
        components: place.address_components.reduce((acc, item) => {
          item.types.forEach(type => {
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push({
              long_name: item.long_name,
              short_name: item.short_name
            });
          });
          return acc;
        }, {})
      };
      setAddressValue(placeWithComponents);
      onChange(placeWithComponents);
    });
  }, [onChange]);

  // Address input change
  const searchAddress = useCallback((_, newInputValue) => {
    setAddressInputValue(newInputValue);
  }, []);

  // Address input renderer
  const renderAddressInput = useCallback((params) => (
    <TextField {...params} fullWidth label={label} />
  ), [label]);

  // Options renderer
  const renderAddressOption = useCallback((props, option) => {
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
      document.querySelector('head').appendChild(script);
    }

    loaded.current = true;
  }

  // Autocomplete predictions fetcher
  const fetch = useMemo(() => throttle((request, callback) => {
    if (autocompleteService.current) autocompleteService.current.getPlacePredictions(request, callback);
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
      setAddressOptions(addressValue ? [addressValue] : []);
      return undefined;
    }

    // Fetch autocomplete predictions
    fetch({ input: addressInputValue }, (results) => {
      if (active) {
        let newOptions = [];

        // Include selected address
        if (addressValue) {
          newOptions = [addressValue];
        }

        // Include fetched predictions
        if (results) {
          newOptions = [...newOptions, ...results];
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
