"use strict";

require("core-js/modules/es.object.assign.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.symbol.description.js");

var _iconsMaterial = require("@mui/icons-material");

var _material = require("@mui/material");

var _parse = _interopRequireDefault(require("autosuggest-highlight/parse"));

var _lodash = _interopRequireDefault(require("lodash.throttle"));

var _react = _interopRequireWildcard(require("react"));

const _excluded = ["apiKey", "label", "onChange", "value"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const autocompleteService = {
  current: null
};
/**
 * AddressAutocomplete component
 * @param {Object} props
 * @param {String} props.apiKey Google Maps API key
 * @param {String} props.label  Label for the input
 * @param {Function} props.onChange  Change callback
 * @param {Object} props.value  Address value
 * @returns {React.ReactElement}
 */

const AddressAutocomplete = _ref => {
  let {
    apiKey,
    label,
    onChange,
    value
  } = _ref,
      rest = _objectWithoutProperties(_ref, _excluded);

  const loaded = _react.default.useRef(false);

  const [addressOptions, setAddressOptions] = _react.default.useState([]);

  const [addressValue, setAddressValue] = _react.default.useState(value);

  const [addressInputValue, setAddressInputValue] = _react.default.useState(''); // Update inner value when props value change


  (0, _react.useEffect)(() => {
    setAddressValue(value);
  }, [value]); // Options label

  const getOptionLabel = (0, _react.useCallback)(option => typeof option === 'string' ? option : option.description, []); // Empty filter

  const filterOptions = (0, _react.useCallback)(x => x, []); // Address selection

  const selectAddress = (0, _react.useCallback)((_, newValue) => {
    setAddressOptions(previous => newValue ? [newValue, ...previous] : previous);
    setAddressValue(newValue);
    onChange(newValue);
  }, [onChange]); // Address input change

  const searchAddress = (0, _react.useCallback)((_, newInputValue) => {
    setAddressInputValue(newInputValue);
  }, []); // Address input renderer

  const renderAddressInput = (0, _react.useCallback)(params => /*#__PURE__*/_react.default.createElement(_material.TextField, _extends({}, params, {
    fullWidth: true,
    label: label
  })), [label]); // Options renderer

  const renderAddressOption = (0, _react.useCallback)((props, option) => {
    const {
      structured_formatting: {
        main_text_matched_substrings: matches
      }
    } = option;
    const parts = (0, _parse.default)(option.structured_formatting.main_text, matches.map(match => [match.offset, match.offset + match.length]));
    return /*#__PURE__*/_react.default.createElement("li", props, /*#__PURE__*/_react.default.createElement(_material.Grid, {
      alignItems: "center",
      container: true
    }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true
    }, /*#__PURE__*/_react.default.createElement(_material.Box, {
      component: _iconsMaterial.LocationOn,
      sx: {
        mr: 2
      }
    })), /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true,
      xs: true
    }, parts.map((part, index) => /*#__PURE__*/_react.default.createElement("span", {
      key: index,
      style: {
        fontWeight: part.highlight ? 700 : 400
      }
    }, part.text)), /*#__PURE__*/_react.default.createElement(_material.Typography, {
      variant: "body2"
    }, option.structured_formatting.secondary_text))));
  }, []); // Load Google Maps API script if not already loaded

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('id', 'google-maps');
      script.src = "https://maps.googleapis.com/maps/api/js?key=".concat(apiKey, "&libraries=places");
      document.querySelector('head').appendChild(script);
    }

    loaded.current = true;
  } // Autocomplete predictions fetcher


  const fetch = (0, _react.useMemo)(() => (0, _lodash.default)((request, callback) => {
    if (autocompleteService.current) autocompleteService.current.getPlacePredictions(request, callback);
  }, 200), []); // Runs on input change

  (0, _react.useEffect)(() => {
    // Lock worker
    let active = true; // Initialize Google Maps Autocomplete Service

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    } // Stop execution if the service is not available


    if (!autocompleteService.current) {
      return undefined;
    } // Hide options when input is empty


    if (addressInputValue === '') {
      setAddressOptions(addressValue ? [addressValue] : []);
      return undefined;
    } // Fetch autocomplete predictions


    fetch({
      input: addressInputValue
    }, results => {
      if (active) {
        let newOptions = []; // Include selected address

        if (addressValue) {
          newOptions = [addressValue];
        } // Include fetched predictions


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
  return /*#__PURE__*/_react.default.createElement(_material.Autocomplete, _extends({
    autoComplete: true,
    filterOptions: filterOptions,
    filterSelectedOptions: true,
    fullWidth: true,
    getOptionLabel: getOptionLabel,
    includeInputInList: true,
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