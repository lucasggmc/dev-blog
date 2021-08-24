import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return(
    <>
      <Head>
        <title>Home | dev-blog</title>
      </Head>    
      <div className={styles.headerContainer}>
        <Header />
      </div>
      <img src="/post-image.svg" alt="" className={styles.principalImage}/>
      <main className={styles.container}>                  
          <header>
            <h1>Criando um app CRA do zero</h1>
            <div className={styles.postInfo}>
              <span>
                <FiCalendar />
                  15 Mar 2021
              </span>

              <span>
                <FiUser />
                Joseph Oliveira
              </span>              

              <span>
                <FiClock />
                4 min
              </span>
            </div>
          </header>  

          <div className={styles.postText}>
            textoooooooooooooooooo
          </div>        

      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
