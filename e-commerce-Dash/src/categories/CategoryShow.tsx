import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  useDefaultTitle,
  useShowContext,
  useRecordContext,
  useTranslate,
} from "react-admin";

const CategoryShowTitle = () => {
  const title = useDefaultTitle();
  const { record } = useShowContext();
  const displayName = record?.en_name || "";
  return (
    <>
      <title>{`${title} - ${displayName}`}</title>
      <span>{displayName}</span>
    </>
  );
};

const CategoryImageField = ({ source }: { source: string }) => {
  const record = useRecordContext();
  const url = record?.[source];
  if (!url) return null;
  return (
    <img
      src={url}
      alt="Category"
      style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }}
    />
  );
};

const CategoryShow = () => {
  const translate = useTranslate();
  return (
    <Show title={<CategoryShowTitle />}>
      <SimpleShowLayout>
        <TextField source="en_name" label={translate("pos.categories.columns.name_en")} />
        <CategoryImageField source="imageURL" />
        <TextField source="ar_name" label={translate("pos.categories.columns.name_ar")} />
        <TextField source="fr_name" label={translate("pos.categories.columns.name_fr")} />
        <BooleanField source="isActive" label={translate("pos.categories.columns.active")} />
      </SimpleShowLayout>
    </Show>
  );
};

export default CategoryShow;
