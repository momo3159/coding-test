const CheckBox = ({ id, isChecked, name, value, onChange }) => (
  <input
    type="checkbox"
    id={id}
    isChecked={isChecked}
    name={name}
    value={value}
    onChange={onChange}
  />
);

export default CheckBox;
