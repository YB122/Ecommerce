import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  ImageInput,
  ImageField,
  BooleanInput,
  useDefaultTitle,
  useEditContext,
  useTranslate,
  required,
} from "react-admin";

const CategoryTitle = () => {
  const appTitle = useDefaultTitle();
  const { defaultTitle } = useEditContext();
  return (
    <>
      <title>{`${appTitle} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const CategoryEdit = () => {
  const translate = useTranslate();
  return (
    <Edit title={<CategoryTitle />}>
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
        <BooleanInput source="isActive" label={translate("pos.categories.form.active")} />
      </SimpleForm>
    </Edit>
  );
};

export default CategoryEdit;

