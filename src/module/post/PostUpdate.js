import Input from "components/Input";
import Label from "components/Label";
import Button from "components/button";
import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import { Field } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import Toggle from "components/toggle/Toggle";
import { db } from "firebase-app/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useFirebseImage from "hooks/useFirebaseImage";
import DashboardHeading from "module/dashboard/DashboardHeading";
import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { postStatus } from "utils/constants";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import axios from "axios";
import ImageUploader from "quill-image-uploader";
import { imgbbAPI } from "config/apiConfig";
Quill.register("modules/imageUploader", ImageUploader);

const PostUpdate = () => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const watchHot = watch("hot");
  const watchStatus = watch("status");
  const [params] = useSearchParams();
  const postId = params.get("id");
  const imageUrl = getValues("image");
  const imageName = getValues("image_name");

  // react quill
  const [content, setContent] = useState("");

  const deletePostImage = async () => {
    const colRef = doc(db, "posts", postId);
    await updateDoc(colRef, {
      image: "",
    });
  };
  const { image, setImage, handleSelectImage, progress, handleDeleteImage } =
    useFirebseImage(setValue, getValues, imageName, deletePostImage);

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  //lúc đầu in ra cái dl cũ
  useEffect(() => {
    async function fetchData() {
      if (!postId) return;
      const docRef = doc(db, "posts", postId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.data()) {
        reset(docSnapshot.data());
        // cái cate lúc đầu
        setSelectCategory(docSnapshot.data()?.category || "");
        setContent(docSnapshot.data()?.content || "");
      }
    }
    fetchData();
  }, [postId, reset]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      let res = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(res);
    }
    getData();
  }, []);
  const [selectCategory, setSelectCategory] = useState("");
  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setValue("categoryName", item.name);
    setSelectCategory(item);
  };
  const updatePostHandler = async (values) => {
  
    const docRef = doc(db, "posts", postId);
    await updateDoc(docRef, {
      ...values,
      image,
      status: Number(values.status),
      content,
    });
    toast.success("Update post successfully");
  };

  // làm cái up hình ảnh lên quill
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: imgbbAPI,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );

  if (!postId) return null;
  return (
    <>
      <DashboardHeading
        desc="Update post content"
        title="Update post"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(updatePostHandler)}>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Title</Label>
            <Input
              control={control}
              placeholder="Enter your title"
              name="title"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              placeholder="Enter your slug"
              name="slug"
            ></Input>
          </Field>
        </div>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Image</Label>
            <ImageUpload
              image={image}
              className="h-[250px]"
              onChange={handleSelectImage}
              progress={progress}
              handleDeleteImage={handleDeleteImage}
            />
          </Field>
          <Field>
            <Label>Category</Label>
            <Dropdown>
              <Dropdown.Select placeholder="Select the category"></Dropdown.Select>
              <Dropdown.List>
                {categories.length > 0 &&
                  categories.map((item) => (
                    <Dropdown.Option
                      onClick={() => handleClickOption(item)}
                      key={item.id}
                    >
                      {item.name}
                    </Dropdown.Option>
                  ))}
              </Dropdown.List>
            </Dropdown>
            {selectCategory?.name && (
              <span className="inline-block p-4 text-sm font-bold text-green-600 rounded-lg bg-green-50 ">
                {selectCategory?.name}
              </span>
            )}
          </Field>
        </div>
        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                modules={modules}
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
          </Field>
        </div>
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Status</Label>
            <div className="flex items-center gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </div>
          </Field>
          <Field>
            <Label>Feature Post</Label>
            <Toggle
              on={watchHot === true}
              onClick={() => setValue("hot", !watchHot)}
            ></Toggle>
          </Field>
        </div>

        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[250px]"
          style={{ display: "flex" }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Update Post
        </Button>
      </form>
    </>
  );
};

export default PostUpdate;
