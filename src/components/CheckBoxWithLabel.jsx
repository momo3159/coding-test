import Checkbox from './CheckBox';

const CheckboxWithLabel = ({ id, isChecked, name, value, onChange, label }) => (
  <div>
    <Checkbox
      id={id}
      value={value}
      name={name}
      ischecked={isChecked}
      onChange={onChange}
    />{' '}
    <label htmlFor={id}>{label}</label>
  </div>
);

export default CheckboxWithLabel;
