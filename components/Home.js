import styles from '../styles/Home.module.css';
import SearchBar from './SearchBar';

export default function Home() {
  return (
    <div className={styles.main}>
      <SearchBar />
    </div>
  );
}
