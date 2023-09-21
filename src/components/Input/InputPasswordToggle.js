import React, { useState } from "react";
import Input from "./Input";
import { IconEyeClose, IconEyeOpen } from "components/icon";

const InputPasswordToggle = ({ control }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handlTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <Input
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Enter Your Password"
        control={control}
      >
        {showPassword ? (
          <IconEyeOpen onClick={handlTogglePassword}></IconEyeOpen>
        ) : (
          <IconEyeClose onClick={handlTogglePassword}></IconEyeClose>
        )}
      </Input>
    </>
  );
};

export default InputPasswordToggle;
