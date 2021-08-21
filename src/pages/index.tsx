import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useState } from 'react';

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

export default function Home({postsPagination}: HomeProps) {  
  const [posts, setPosts] = useState(postsPagination.results);  
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  function handleLoadPosts(){  
    console.log('nextPage', nextPage);

    if(nextPage){
      fetch(nextPage)
      .then(response => response.json())
      .then(data => {              
        let postsResponse = data.results.map(post => {
          return {
            uid: post.uid,      
            first_publication_date: format(
              new Date(post.first_publication_date),
              "dd LLL yyyy",
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            }
          }
        })

        setPosts([...posts, ...postsResponse])
        setNextPage(data.next_page);
      })
    }

  }

  return(
    <>
      <Head>
        <title>Home | dev-blog</title>
      </Head>
      <main className={styles.container}>               
          <header className={styles.homeHeader}>
          <img src="/icons/greater-less-sign.svg" alt="logo" />
          <p>spacetraveling</p>          
          </header>
            { posts.map(post => (
              <div className={styles.postContainer} key={post.uid}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <footer>
                <div>
                  <span>
                    <FiCalendar />
                  {post.first_publication_date}
                  </span>
                  <span>
                    <FiUser />
                    {post.data.author}
                  </span>
                </div>
              </footer>
            </div>    
            ))}              

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

           { nextPage && <span className={styles.loadPosts} onClick={handleLoadPosts}>Carregar mais posts</span> }

      </main>
    </>
  )
}

export const getStaticProps:GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
          fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.content'],
          pageSize: 1,
    })

    //console.log('rr', postsResponse)
    console.log('rr', JSON.stringify(postsResponse, null, 2));

  let posts = postsResponse.results.map(post => {
    var date = format(
      new Date(post.first_publication_date),
      "dd LLL yyyy",
      {
        locale: ptBR,
      }
    )
    
    return {            
        uid: post.uid,      
        first_publication_date: date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        }
      }    

  })  

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts
  }


  return {
    props: {
      postsPagination
    }
  }

};
