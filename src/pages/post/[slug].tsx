import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Header from '../../components/Header';
import { RichText } from "prismic-dom";
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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

export default function Post({post}: PostProps) {  
  const router = useRouter()
  const wordsLenght = post.data.content.reduce((total, element) => {     
    let body = RichText.asText(element.body);      
    let heading = element.heading;
    let bodyHeading = body.concat(heading);
    let textArray = bodyHeading.split(/\s+/).length;   

    total += textArray; 
    //console.log('total', total / 200);
    //return Math.ceil(total / 200);
    return total;
    }, 0);   

    const readingTime = Math.ceil(wordsLenght / 200);

  if (router.isFallback) {
    return <div>Carregando...</div>
  }

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
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <span>
                <FiCalendar />
                  {
                    format(
                      new Date(post.first_publication_date),
                      "dd LLL yyyy",
                      {
                        locale: ptBR,
                      }
                    )  
                  }
              </span>

              <span>
                <FiUser />
                { post.data.author}
              </span>              

              <span>
                <FiClock />
                {readingTime} min
              </span>
            </div>
          </header>  

          <article className={styles.post}>
          {post?.data.content.map(({ heading, body }) => (
          <div key={heading}>
            <h2>{heading}</h2>

            <div
              className={styles.postSection}
              dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }}
            />
          </div>
        ))}

          </article>        

      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.content'],
      pageSize: 2,
    })
  
  let paths = posts.results.map(post => {
    return {
      params: { slug: post.uid }
    }
  })

  return {
    paths,
    fallback: true //true, false, 'blocking'
}
};

export const getStaticProps:GetStaticProps = async({params}) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  
  const response = await prismic.getByUID("posts", String(slug), {});
  // console.log('ress', JSON.stringify(response, null, 2));
  // console.log('reeee', response);
  
  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30 //30 min
  }  
};
