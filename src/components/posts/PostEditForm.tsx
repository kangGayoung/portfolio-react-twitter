import {FiImage} from "react-icons/fi";
import React, {useCallback, useContext, useEffect, useState} from "react";
import { updateDoc, doc, getDoc  } from "firebase/firestore";
import {db, storage} from "../../firebaseApp";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {PostProps} from "../../pages/home";
import {deleteObject, getDownloadURL, ref, uploadString} from "firebase/storage";
import {v4 as uuidv4} from "uuid";
import AuthContext from "../../context/AuthContext";
import PostHeader from "./PostHeader";
import useTranslation from "../../hooks/useTranslation";

export default function PostEditForm(){
    const [hashTag, setHashTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<string | null>(null);
    // 이미지 업로드 중 확인 //이미지 여러번 업로드 안되게
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    // url id 값을 확인하기 위해 파람 만들기
    const params = useParams();
    //console.log(params); // id 확인
    const [post, setPost] = useState<PostProps | null>(null);
    const [content, setContent] = useState<string>("");
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);
    const t = useTranslation();

    const handleFileUpload = (e:any) => {
        const {
            target:{files},
        }=e;

        const file = files?.[0];
        const fileReader = new FileReader(); // 업로드된 파일을 읽어줌
        fileReader?.readAsDataURL(file); // 업로드 파일의 인코딩된 데이터 URL

        fileReader.onloadend = (e:any) => {
            const {result} = e?.currentTarget; //구조분해
            setImageFile(result);
        }
    };

    const getPost = useCallback(async() =>{
        if(params.id){
            const docRef = doc(db, "posts", params.id);
            const docSnap = await getDoc(docRef);
            //console.log(docSnap.data(), docSnap.id);
            setPost({...(docSnap?.data() as PostProps), id:docSnap.id});
            setContent(docSnap?.data()?.content);

            //게시글 가져올때 작성됐던 해시태그도 가져오기
            setTags(docSnap?.data()?.hashTags);
            // 파일 가져오기
            setImageFile(docSnap?.data()?.imageUrl);
        }
    },[params.id])

    const onSubmit = async (e: any) => {
        setIsSubmitting(true);
        const key = `${user?.uid}/${uuidv4()}`;
        const storageRef = ref(storage, key);
        e.preventDefault();

        try {
            if(post){
                // 기존 사진 지우고 
                if(post?.imageUrl){
                    let imageRef = ref(storage, post?.imageUrl);
                    await deleteObject(imageRef).catch((error) => {
                        console.log(error);
                    })
                }
                // 새로운 파일 있다면 업로드
                let imageUrl = "";
                if (imageFile){
                    const data = await uploadString(storageRef, imageFile, "data_url");
                    imageUrl = await getDownloadURL(data?.ref);
                }

                const postRef = doc(db, "posts", post?.id);
                await updateDoc(postRef, {
                    content:content,
                    hashTag: tags, // 새로운 태그 수정해서 게시
                    imageUrl: imageUrl, //이미지 수정한 후 다시 게시
                });
                navigate(`/posts/${post?.id}`);
                toast.success("게시글을 수정했습니다.");
            }
            setImageFile(null);
            setIsSubmitting(false);
        } catch (e:any){
            console.log(e);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {
            target: {name, value},
        } = e;
        //console.log(name, value);

        if (name === "content"){
            setContent(value);
        }
    };

    //클릭시 해당태그 삭제 (클릭된 태그 == tag 같은 값은 삭제)
    const removeTag = (tag: string) => {
        setTags(tags?.filter((val) => val !== tag));
    };

    const onChangeHashTag = (e: any) => {
        setHashTag(e?.target?.value?.trim());
    };

    const handleKeyUp = (e: any) => {
        // 해당키가 스페이스 바인지 확인
        if (e.keyCode === 32 && e.target.value.trim() !== "") {
            // 만약 같은 태그가 있다면 에러를 띄운다
            // 아니라면 태그를 생성해준다
            if (tags?.includes(e.target.value?.trim())) {
                toast.error("같은 태그가 있습니다.");
            } else {
                setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
                setHashTag("");
            }
        }
    };

    const handleDeleteImage = () => {
        setImageFile(null); //setImageFile 초기화
    }

    useEffect(()=>{
        if(params.id) getPost();
    },[getPost, params.id]);

    return(
        <div className="post">
            <PostHeader/>
            <form className="post-form" onSubmit={onSubmit}>
            <textarea className="post-form_textarea" required name="content" id="content"
                      placeholder={t("POST_PLACEHOLDER")} onChange={onChange} value={content}/>
                <div className="post-form_hashtags">
                <span className="post-form_hashtags-outputs">
                  {tags?.map((tag, index) => (
                      <span
                          className="post-form_hashtags-tag"
                          key={index}
                          onClick={() => removeTag(tag)}
                      >
                          #{tag}
                      </span>
                  ))}
                </span>
                    <input
                        className="post-form_input"
                        name="hashtag"
                        id="hashtag"
                        placeholder={t("POST_PLACEHOLDER")}
                        onChange={onChangeHashTag}
                        onKeyUp={handleKeyUp}
                        value={hashTag}
                    />
                </div>
                <div className="post-form_submit-area">
                    <div className="post-form_image-area">
                        <label htmlFor="file-input" className="post-form_file">
                            <FiImage className="post-form_file-icon"/>
                        </label>
                        <input type="file" name="file-input" id="file-input" accept="image/*"
                               onChange={handleFileUpload}
                               className="hidden"/>
                        {imageFile && (
                            <div className="post-form_attachment">
                                {/*업로드 된 이미지가 스트링 소스가 아니라 이미지로 인코딩 되게 해 줌 */}
                                <img src={imageFile} alt="attachment" width={100} height={100}/>
                                <button className="post-form_clear-btn" type="button"
                                        onClick={handleDeleteImage}>
                                    {t("BUTTON_DELETE")}
                                </button>
                            </div>
                        )}
                    </div>
                    <input type="submit" value="수정" className="post-form_submit-btn"
                           disabled={isSubmitting}/>
                </div>
            </form>
        </div>


    );
}