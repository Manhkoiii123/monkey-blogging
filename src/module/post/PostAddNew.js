import Input from "components/Input";
import Label from "components/Label";
import Button from "components/button";
import { Radio } from "components/checkbox";
import { Dropdown } from "components/dropdown";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";
import styled from "styled-components";
import { postStatus } from "utils/constants";
import ImageUpload from "components/image/ImageUpload";
import useFirebaseImage from "hooks/useFirebaseImage";
import Toggle from "components/toggle/Toggle";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import { useAuth } from "contexts/auth-context";
import { toast } from "react-toastify";
import { Field } from "components/field";
import DashboardHeading from "module/dashboard/DashboardHeading";

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { userInfo } = useAuth();
  const { handleSubmit, control, watch, setValue, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      category: {},
      hot: false,
      image: "",
      user: {},
      categoryName: "",
    },
  });
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const {
    image,
    setImage,
    progress,
    setProgess,
    handleSelectImage,
    handleDeleteImage,
  } = useFirebaseImage(setValue, getValues);

  //add bài
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.uid) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email]);

  const addPostHandler = async (values) => {
    setLoading(true);
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      cloneValues.status = Number(values.status);
      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValues,
        categoryId: cloneValues.category.id,
        userId: cloneValues.user.id,
        image: image,
        createdAt: serverTimestamp(),
      });
      toast.success("Create new post successfully");
      reset({
        title: "",
        slug: "",
        status: 2,
        category: {},
        hot: false,
        image: "",
        categoryName: "",
        user: {},
      });
      setImage("");
      setProgess(0);
      setSelectCategory({});
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //lấy all cate trong firebase

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

  useEffect(() => {
    document.title = "Monkey Blogging - Add new post";
  }, []);

  return (
    <PostAddNewStyles>
      <DashboardHeading desc="Add new post" title="Add new"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
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
        <div className="grid grid-cols-2 mb-10 gap-x-10">
          <Field>
            <Label>Status</Label>
            <div className="flex items-center gap-x-5">
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                // onClick={() => setValue("status", postMessage.APPROVED)}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                // onClick={() => setValue("status", "pending")}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                // onClick={() => setValue("status", "reject")}
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
          className="mx-auto w-[250px] "
          isLoading={loading}
          disabled={loading}
        >
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
