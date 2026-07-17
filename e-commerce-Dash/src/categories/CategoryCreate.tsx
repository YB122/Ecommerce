import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  required,
  useRedirect,
  useTranslate,
} from "react-admin";

const CategoryCreate = () => {
  const redirect = useRedirect();
  const translate = useTranslate();
  return (
    <Create
      redirect={false}
      mutationOptions={{
        onSuccess: () => {
          redirect("/categories/create");
        },
      }}
    >
      <SimpleForm>
        <TextInput source="en_name" validate={required()} fullWidth />
        <TextInput source="ar_name" fullWidth />
        <TextInput source="fr_name" fullWidth />
        <ImageInput
          source="image"
          label={translate("pos.categories.form.image")}
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        >
          <ImageField source="src" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};

export default CategoryCreate;
