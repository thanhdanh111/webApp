interface VehicleValue {
  vehicle: string;
  num?: number;
}

const initialState: VehicleValue = {
  vehicle: '',
  num: 0,
};

const reducerVehicle = (state = initialState, action) => {
  switch (action.type) {
    case 'Bike':
      return {
        ...state,
        vehicle: action.type,
      };
    case 'Car':
      return {
        ...state,
        vehicle: action.type,
      };
    default:
      return state;
  }
};

export default reducerVehicle;
