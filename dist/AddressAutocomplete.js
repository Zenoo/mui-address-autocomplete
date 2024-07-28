"use strict";

require("core-js/modules/es.object.assign.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.array.reduce.js");
var _LocationOn = _interopRequireDefault(require("@mui/icons-material/LocationOn"));
var _material = require("@mui/material");
var _parse = _interopRequireDefault(require("autosuggest-highlight/parse"));
var _lodash = _interopRequireDefault(require("lodash.throttle"));
var _react = _interopRequireWildcard(require("react"));
var _jsApiLoader = require("@googlemaps/js-api-loader");
const _excluded = ["apiKey", "fields", "label", "onChange", "value", "requestOptions"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
const autocompleteService = {
  current: null
};
const placesService = {
  current: null
};

/**
 * AddressAutocomplete Component
 */
const AddressAutocomplete = _ref => {
  let {
      apiKey,
      fields = ['address_components', 'formatted_address'],
      label,
      onChange,
      value,
      requestOptions = {}
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const [addressOptions, setAddressOptions] = (0, _react.useState)([]);
  const [addressValue, setAddressValue] = (0, _react.useState)(value);
  const [addressInputValue, setAddressInputValue] = (0, _react.useState)('');
  const [google, setGoogle] = (0, _react.useState)(null);

  // Update inner value when props value change
  (0, _react.useEffect)(() => {
    setAddressValue(value);
  }, [value]);

  // Prefill fields if needed
  const actualFields = (0, _react.useMemo)(() => {
    if (!fields.includes('address_components')) {
      fields.push('address_components');
    }
    if (!fields.includes('formatted_address')) {
      fields.push('formatted_address');
    }
    return fields;
  }, [fields]);

  // Options label
  const getOptionLabel = option => typeof option === 'string' ? option : option.description;

  // Autocomplete equals
  const isOptionEqualToValue = (option, val) => option.place_id === val.place_id;

  // Empty filter
  const filterOptions = x => x;

  // Address selection
  const selectAddress = (event, newValue, reason) => {
    if (!placesService.current) {
      return;
    }
    setAddressOptions(previous => newValue ? [newValue, ...previous] : previous);
    if (newValue && newValue.place_id) {
      placesService.current.getDetails({
        placeId: newValue.place_id,
        fields: actualFields
      }, place => {
        var _place$formatted_addr;
        if (!place) {
          return;
        }
        const placeWithComponents = _objectSpread(_objectSpread({}, place), {}, {
          structured_formatting: {
            main_text: place.formatted_address || '',
            secondary_text: place.name || '',
            main_text_matched_substrings: [{
              offset: 0,
              length: ((_place$formatted_addr = place.formatted_address) === null || _place$formatted_addr === void 0 ? void 0 : _place$formatted_addr.length) || 0
            }]
          },
          components: (place.address_components || []).reduce((acc, item) => {
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
          }, {}),
          description: newValue.description,
          place_id: newValue.place_id
        });
        setAddressValue(placeWithComponents);
        onChange(event, placeWithComponents, reason);
      });
    } else {
      setAddressValue(null);
      onChange(event, null, reason);
    }
  };

  // Address input change
  const searchAddress = (_, newInputValue) => {
    setAddressInputValue(newInputValue);
  };

  // Address input renderer
  const renderAddressInput = params => /*#__PURE__*/_react.default.createElement(_material.TextField, _extends({}, params, {
    fullWidth: true,
    label: label
  }));

  // Options renderer
  const renderAddressOption = (props, option) => {
    const {
      structured_formatting: {
        main_text_matched_substrings: matches
      }
    } = option;
    if (!matches) return null;
    const parts = (0, _parse.default)(option.structured_formatting.main_text, matches.map(match => [match.offset, match.offset + match.length]));
    return /*#__PURE__*/_react.default.createElement(_material.Box, _extends({
      component: "li"
    }, props), /*#__PURE__*/_react.default.createElement(_material.Grid, {
      alignItems: "center",
      container: true
    }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true
    }, /*#__PURE__*/_react.default.createElement(_material.Box, {
      component: _LocationOn.default,
      sx: {
        mr: 2
      }
    })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true,
      xs: true
    }, parts.map((part, index) => /*#__PURE__*/_react.default.createElement("span", {
      // eslint-disable-next-line react/no-array-index-key
      key: index,
      style: {
        fontWeight: part.highlight ? 700 : 400
      }
    }, part.text)), /*#__PURE__*/_react.default.createElement(_material.Typography, {
      variant: "body2"
    }, option.structured_formatting.secondary_text))));
  };

  // Load Google Maps API if not already loaded
  (0, _react.useEffect)(() => {
    if (google) return;
    if (!apiKey) {
      console.error('You need to provide an API key to use this component');
      return;
    }
    const loader = new _jsApiLoader.Loader({
      apiKey,
      version: 'weekly'
    });
    loader.importLibrary('places').then(google => {
      setGoogle(google);
    }).catch(err => {
      console.error(err);
    });
  }, [apiKey]);

  // Autocomplete predictions fetcher
  const fetch = (0, _react.useMemo)(() => (0, _lodash.default)((request, callback) => {
    if (autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(request, callback);
    }
  }, 200), []);

  // Runs on input change
  (0, _react.useEffect)(() => {
    // Lock worker
    let active = true;
    if (!google) return;

    // Initialize Google Maps Autocomplete Service
    if (!autocompleteService.current) {
      autocompleteService.current = new google.AutocompleteService();
    }
    // Initialize Google Maps Places Service
    if (!placesService.current) {
      placesService.current = new google.PlacesService(document.createElement('div'));
    }
    // Stop execution if the service is not available
    if (!autocompleteService.current || !placesService.current) {
      return undefined;
    }

    // Hide options when input is empty
    if (addressInputValue === '') {
      setAddressOptions(prev => {
        if (addressValue && !prev.find(o => o.place_id === addressValue.place_id)) {
          return [addressValue];
        }
        return [];
      });
      return undefined;
    }

    // Fetch autocomplete predictions
    fetch(_objectSpread(_objectSpread({}, requestOptions), {}, {
      input: addressInputValue
    }), results => {
      if (active) {
        let newOptions = [];

        // Include fetched predictions
        if (results) {
          newOptions = results;
        }
        if (addressValue) {
          const fetchedAddressValueIndex = newOptions.findIndex(o => o.place_id === addressValue.place_id);
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
  return /*#__PURE__*/_react.default.createElement(_material.Autocomplete, _extends({
    autoComplete: true,
    filterOptions: filterOptions,
    filterSelectedOptions: true,
    fullWidth: true,
    getOptionLabel: getOptionLabel,
    includeInputInList: true,
    isOptionEqualToValue: isOptionEqualToValue,
    onChange: selectAddress,
    onInputChange: searchAddress,
    options: addressOptions,
    renderInput: renderAddressInput,
    renderOption: renderAddressOption,
    value: addressValue
  }, rest));
};
var _default = AddressAutocomplete;
exports.default = _default;