import logo from "../../assets/logo.png";

const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <img src={logo} alt="logo" />
      <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wider">
        ZapShift
      </h2>
    </div>
  );
};

export default Logo;
