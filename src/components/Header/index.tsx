import { useRouter } from 'next/router';
import styles from './header.module.scss';

export default function Header() {
  const router = useRouter();

  function handleRedirectHome(){
    router.push(`/`);
  }

  return (
    <header className={styles.homeHeader}>
      {/* <img src="/greater-less-sign.svg" alt="logo" />
      <p>spacetraveling</p> */}
      <img src="/logo.svg" alt="logo" onClick={handleRedirectHome} />
    </header>
  );
}
