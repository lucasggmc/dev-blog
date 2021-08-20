import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  // TODO

  return(
    <>
      <Head>
        <title>Home | dev-blog</title>
      </Head>
      <main className={styles.container}>               
          <header className={styles.homeHeader}>
          <img src="/icons/greater-less-sign.svg" alt="" />
          <p>spacetraveling</p>          
          </header>

            <div className={styles.postContainer}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <div>
                  <span>
                    <FiCalendar />
                  15 Mar 2021
                  </span>
                  <span>
                    <FiUser />
                    Joseph Oliveira
                  </span>
                </div>
              </footer>
            </div>      

            <div className={styles.postContainer}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <div>
                  <span>
                    <FiCalendar />
                  15 Mar 2021
                  </span>
                  <span>
                    <FiUser />
                    Joseph Oliveira
                  </span>
                </div>
              </footer>
            </div>   

           <span className={styles.loadPosts}>Carregar mais posts</span>

      </main>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
