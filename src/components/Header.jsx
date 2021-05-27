import styles from './Header.module.css'

const Header = ({title}) => (
  <header className={styles.header}>
    <span className={styles.title}>{title}</span>
  </header>
)

export default Header