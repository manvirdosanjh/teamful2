import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-helsinki',
    predictionPlace: {
      address: 'Toronto, Canada',
      bounds: new LatLngBounds(new LatLng(43.8554654957061, -79.1134670108977), new LatLng(43.5603428815601, -79.639302406235)),
    },
  },
  {
    id: 'default-turku',
    predictionPlace: {
      address: 'Mississauga, Canada',
      bounds: new LatLngBounds(new LatLng(43.7373339336417, -79.5229596450297), new LatLng(43.4749149929767, -79.8102527071155)),
    },
  },
  {
    id: 'default-tampere',
    predictionPlace: {
      address: 'Vaughan, Canada',
      bounds: new LatLngBounds(new LatLng(43.9242717907208, -79.4200736042182), new LatLng(43.7498457077124, -79.711512755242)),
    },
  },
  {
    id: 'default-oulu',
    predictionPlace: {
      address: 'Brampton, Canada',
      bounds: new LatLngBounds(new LatLng(43.8477181194161, -79.6302701079865), new LatLng(43.6022314382896, -79.8888708958365)),
    },
  },
  {
    id: 'default-ruka',
    predictionPlace: {
      address: 'Hamilton, Canada',
      bounds: new LatLngBounds(new LatLng(43.4710560077517, 79.6220497295972), new LatLng(43.0505164940896, -80.2484862145317)),
    },
  },
];
