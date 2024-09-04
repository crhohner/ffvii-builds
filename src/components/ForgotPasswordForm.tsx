interface ForgotPasswordProps {
  action: (formData: FormData) => Promise<void>;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordProps> = (
  props: ForgotPasswordProps
) => {
  return (
    <div className="center">
      <div className="container">
        <br />
        <h1>Forgot your password?</h1>

        <h2 style={{ fontSize: "var(--body-text)", paddingTop: "6px" }}>
          No big deal!
        </h2>

        <br />
        <form style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="email">email:</label>
          <input id="email" name="email" type="email" required />
          <br />
          <button formAction={props.action}>send reset link</button>
        </form>
      </div>
    </div>
  );
};
