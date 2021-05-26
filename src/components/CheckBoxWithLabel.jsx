import Checkbox from './Checkbox';

const CheckboxWithLabel = ({ id, isChecked, name, value, onChange, label }) => (
  <div>
    <Checkbox
      id={id}
      value={value}
      name={name}
      isChecked={isChecked}
      onChange={onChange}
    />{' '}
    <label htmlFor={id}>{label}</label>
  </div>
);

export default CheckboxWithLabel;
