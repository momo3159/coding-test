import Checkbox from './CheckBox';

const CheckboxWithLabel = ({ id, ischecked, name, value, onChange, label }) => (
  <div>
    <Checkbox
      id={id}
      value={value}
      name={name}
      ischecked={ischecked}
      onChange={onChange}
    />{' '}
    <label htmlFor={id}>{label}</label>
  </div>
);

export default CheckboxWithLabel;
