import style from "./Login.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstButtonWasClick, setFirstButtonWasClick] = useState(false);
  const [showErrorLogin, setShowErrorLogin] = useState(false);
  const [loader, setLoader] = useState(false);

  const altTitleOne = showPassword
    ? "Ocultar contraseña"
    : "Mostrar contraseña";

  const checkRegexEmail = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w{2,})*(\.\w{2,})+$/;
  const emailIsValid = checkRegexEmail.test(email);
  const checkEmailNotEmpty = email?.length != 0;
  const checkEmailValidNotEmpty = checkEmailNotEmpty && !emailIsValid;
  const showEmailError = firstButtonWasClick
    ? !emailIsValid
    : checkEmailValidNotEmpty;
  const checkErrorMessage =
    checkEmailNotEmpty && !emailIsValid
      ? "Correo no valido"
      : "Correo requerido";

  const showPasswordError = firstButtonWasClick && !password;

  const login = async () => {
    setLoader(true);
    if (emailIsValid && password) {
      const result = await signIn("credentials", {
        redirect: false,
        username: email,
        password,
      });

      if (result?.error) {
        console.log("Auth error", result?.error);
        setShowErrorLogin(true);
        setLoader(false);
      } else {
        router.replace("/");
        setLoader(false);
      }
    } else {
      setFirstButtonWasClick(true);
      setLoader(false);
    }
  };

  const hidePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      login();
    }
  };

  return (
    <section className={style.section}>
      {loader && <div className={style.loader}>Cargando...</div>}
      <div className={style.content}>
        <div className={style.image_content}>
          <div className={style.img_3}>
            <Image
              alt=""
              src="/login/login-person.jpeg"
              fill
              className={style.img_1}
            />
          </div>
          <Image
            alt=""
            src="/login/login-persone.png"
            fill
            className={style.img_2}
          />
        </div>
        <div>
          <Image
            alt=""
            src="/logo-2.png"
            width={300}
            height={200}
            className=""
            style={{ margin: "auto", position: "relative", display: "block" }}
          />
          <p className={style.title} role="heading">
            PORTAL DEL EMPLEADO
          </p>
          <div className={style.box}>
            <div className={style.grid}>
              <div>
                <p className={style.label}>Correo electrónico:</p>
                <div className={style.input_box}>
                  <input
                    type="email"
                    className={showEmailError ? style.input : style.input}
                    placeholder="correo@ejemplo.com"
                    aria-label="Email"
                    role="input"
                    value={email}
                    onKeyDown={handleKeyDown}
                    onChange={(ev) => {
                      setEmail(ev.target.value);
                      setFirstButtonWasClick(false);
                      setShowErrorLogin(false);
                    }}
                    autoComplete="off"
                  />
                  <img src="/user.png" alt="" className={style.user_icon} />
                </div>
                <div className={style.input_warning}>
                  <p
                    className={
                      showEmailError ? style.show_error : style.hide_error
                    }
                  >
                    {/* <b>&#9888;</b> {checkErrorMessage} */}
                  </p>
                </div>
              </div>
              <div>
                <p className={style.label}>Contraseña:</p>
                <div className={style.input_box}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={
                      showPasswordError ? style.input_error : style.input
                    }
                    placeholder="Ingresa tu contraseña"
                    aria-label="Password"
                    role="input"
                    value={password}
                    onKeyDown={handleKeyDown}
                    onChange={(ev) => {
                      setPassword(ev.target.value);
                      setFirstButtonWasClick(false);
                      setShowErrorLogin(false);
                    }}
                  />
                  <img
                    onClick={hidePassword}
                    src={showPassword ? "/login/hide.png" : "/login/show.png"}
                    alt={altTitleOne}
                    title={altTitleOne}
                    className={style.password_icon}
                    data-testid="toggle-password"
                  />
                </div>
                <div className={style.password_warning}>
                  <p
                    className={
                      showPasswordError ? style.show_error : style.hide_error
                    }
                  >
                    {/* <b>&#9888;</b> Contraseña requerida */}
                  </p>
                </div>
              </div>
              <p
                className={showErrorLogin ? style.show_error : style.hide_error}
              >
                {" "}
                {/* <b>&#9888;</b> Datos erróneos, favor de verificar su
                información. */}
              </p>
            </div>
            <button id="login" onClick={login} className={style.button}>
              Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
