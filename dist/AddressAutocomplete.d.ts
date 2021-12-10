export interface BoxTypeMap<P = {}> {
  props: P & {
    apiKey: string;
    label: string;
  };
}

/**
 * AddressAutocomplete component
 * @param {Object} props
 * @param {String} props.apiKey Google Maps API key
 * @param {String} props.label  Label for the input
 * @returns {React.ReactElement}
 */
declare const AddressAutocomplete: React.ReactElement<BoxTypeMap>;