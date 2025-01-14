export type SelectOption = {
  label: string;
  value: string;
  children?: SelectOption[];
};

export const initSelectOption = (): SelectOption => {
  return {
    label: '',
    value: '',
  };
};
