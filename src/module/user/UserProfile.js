import Input from "components/Input";
import Label from "components/Label";
import Button from "components/button";
import { Field } from "components/field";
import ImageUpload from "components/image/ImageUpload";
import Textarea from "components/textarea";
import { useAuth } from "contexts/auth-context";
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
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const { userInfo } = useAuth();
  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.uid) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      const res = [];
      querySnapshot.forEach((doc) => {
        res.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUser(res[0]);
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.email]);
  const userId = user.id;
  const { control, handleSubmit, setValue, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      avatar: "",
      description: "",
      fullname: "",
      username: "",
      birthday: "",
      phone: "",
      email: "",
    },
  });
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
  const deleteAvatar = async () => {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  };
  const { image, setImage, handleSelectImage, progress, handleDeleteImage } =
    useFirebseImage(setValue, getValues, imageName, deleteAvatar);

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      const colRef = doc(db, "users", userId);
      const docData = await getDoc(colRef);
      const data = docData && docData.data();
      const {
        avatar,
        fullname,
        username,
        description,
        email,
        birthday,
        phone,
      } = data;
      reset({
        avatar,
        description: description || "",
        fullname,
        username,
        birthday: birthday || "",
        phone: phone || "",
        email,
      });
    }
    fetchData();
  }, [userId, reset]);
  const handleUpdateProfile = async (values) => {
    if (!userId) return;
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      ...values,
    });
    toast.success("Update Profile Successfully");
  };
  return (
    <div>
      <DashboardHeading
        title="Account information"
        desc="Update your account information"
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="w-[200px] h-[200px] mx-auto rounded-full mb-10">
          <ImageUpload
            image={image}
            onChange={handleSelectImage}
            progress={progress}
            handleDeleteImage={handleDeleteImage}
          />
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              control={control}
              name="fullname"
              placeholder="Enter your fullname"
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              control={control}
              name="username"
              placeholder="Enter your username"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Date of Birth</Label>
            <Input
              control={control}
              name="birthday"
              placeholder="dd/mm/yyyy"
            ></Input>
          </Field>
          <Field>
            <Label>Mobile Number</Label>
            <Input
              control={control}
              name="phone"
              placeholder="Enter your phone number"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              control={control}
              name="email"
              type="email"
              placeholder="Enter your email address"
            ></Input>
          </Field>
          <Field>
            <Label>Description</Label>
            <Textarea control={control} name="description"></Textarea>
          </Field>
        </div>

        <Button
          kind="primary"
          type="submit"
          className="mx-auto w-[200px]"
          style={{ display: "flex" }}
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
