const CheckBox = ({ id, ischecked, name, value, onChange }) => (
  <input
    type="checkbox"
    id={id}
    checked={ischecked ? "checked" : undefined}
    name={name}
    value={value}
    onChange={onChange}
  />
);

export default CheckBox;
