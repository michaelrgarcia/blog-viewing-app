import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "../../components/Form/Form";

import { InputProps } from "../../components/Form/FormComponents/Inputs/InputProps";

import "./Register.module.css";

function Register() {
  const [formFields, setFormFields] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const onUsernameUpdate = (e: FormEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, username: e.currentTarget.value });
  };

  const onPasswordUpdate = (e: FormEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, password: e.currentTarget.value });
  };

  const onConfirmPasswordUpdate = (e: FormEvent<HTMLInputElement>) => {
    setFormFields({ ...formFields, confirmPassword: e.currentTarget.value });
  };

  const onRegister = async (e: FormEvent<SubmitEvent>) => {
    e.preventDefault();

    if (formFields.password !== formFields.confirmPassword) {
      e.preventDefault();

      return setError("Passwords do not match.");
    }

    try {
      const endpoint = import.meta.env.VITE_MY_BLOG_API;

      const registerAttempt = await fetch(`${endpoint}/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formFields.username,
          password: formFields.password,
        }),
      });

      const { message } = await registerAttempt.json();

      if (registerAttempt.ok) {
        navigate("/login");
      } else {
        setError(message);
      }
    } catch (err: unknown) {
      console.error(err);

      setError("Error. Please try again.");
    }
  };

  const registerFormInputs: InputProps[] = [
    {
      id: "username",
      labelText: "Username",
      value: formFields.username,
      onChange: (e) => onUsernameUpdate(e),
      type: "text",
    },
    {
      id: "password",
      labelText: "Password",
      value: formFields.password,
      onChange: (e) => onPasswordUpdate(e),
    },
    {
      id: "confirmPassword",
      labelText: "Confirm Password",
      value: formFields.confirmPassword,
      onChange: (e) => onConfirmPasswordUpdate(e),
    },
  ];

  return (
    <>
      <h1>My Fake Blog</h1>
      <main>
        <Form
          inputs={registerFormInputs}
          submitBtnTxt="Register"
          submitBtnColor="rgb(105, 192, 135)"
          error={error}
          onSubmit={onRegister}
        />
      </main>
    </>
  );
}

export default Register;
