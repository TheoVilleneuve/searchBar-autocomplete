import styles from "../styles/Home.module.css";
import SearchBar from "./SearchBar";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.imgHeader}>
        <SearchBar/>
        <h1 className={styles.catchPhrase}>Go wherever you want, <br/> Whenever you want.</h1>
      </div>
      
    </div>
  );
}
