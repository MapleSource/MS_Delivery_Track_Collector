import Header from "@/components/Layout/Header";
import ZipCodeForm from "@/components/Modules/ZipCodes/ZipCodeForm";

export default function NewZipCodePage() {
  return (
    <>
      <Header title="Nuevo codigo postal" />
      <ZipCodeForm />
    </>
  );
}
