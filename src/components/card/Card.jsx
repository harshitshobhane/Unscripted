import Image from "next/image";
import styles from "./card.module.css";
import Link from "next/link";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const Card = ({ item }) => {
  const likeCount = item.blogVotes ? item.blogVotes.filter(v => v.value === 1).length : 0;
  const dislikeCount = item.blogVotes ? item.blogVotes.filter(v => v.value === -1).length : 0;
  return (
    <div className={styles.container}>
      {item.img && (
        <div className={styles.imageContainer}>
          <Image src={item.img} alt="" fill className={styles.image} />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {item.createdAt.substring(0, 10)} -{" "}
          </span>
          <span className={styles.category}>{item.catSlug}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1>{item.title}</h1>
        </Link>
        {/* <p className={styles.desc}>{item.desc.substring(0, 60)}</p> */}
        <div className={styles.desc} dangerouslySetInnerHTML={{ __html: item?.desc.substring(0,60) }}/>
        <div className={styles.voteRow}>
          <span className={styles.vote}><FaThumbsUp /> {likeCount}</span>
          <span className={styles.vote}><FaThumbsDown /> {dislikeCount}</span>
        </div>
        <Link href={`/posts/${item.slug}`} className={styles.link}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;
