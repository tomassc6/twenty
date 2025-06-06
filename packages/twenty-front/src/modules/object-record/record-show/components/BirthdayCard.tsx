import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { useIsRecordReadOnly } from '@/object-record/record-field/hooks/useIsRecordReadOnly';
import { isFieldValueEmpty } from '@/object-record/record-field/utils/isFieldValueEmpty';
import { isFieldValueReadOnly } from '@/object-record/record-field/utils/isFieldValueReadOnly';
import { useRecordShowContainerActions } from '@/object-record/record-show/hooks/useRecordShowContainerActions';
import { useRecordShowContainerData } from '@/object-record/record-show/hooks/useRecordShowContainerData';
import { RecordDetailBirthdaySection } from '@/object-record/record-show/record-detail-section/components/RecordDetailBirthdaySection';
import { useRecordFieldValue } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { isFieldCellSupported } from '@/object-record/utils/isFieldCellSupported';
import { FieldMetadataType } from '~/generated/graphql';

type BirthdayCardProps = {
  objectNameSingular: string;
  objectRecordId: string;
};

export const BirthdayCard = ({
  objectNameSingular,
  objectRecordId,
}: BirthdayCardProps) => {
  const { recordLoading, labelIdentifierFieldMetadataItem, isPrefetchLoading } =
    useRecordShowContainerData({
      objectNameSingular,
      objectRecordId,
    });

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { objectMetadataItems } = useObjectMetadataItems();

  const { useUpdateOneObjectRecordMutation } = useRecordShowContainerActions({
    objectNameSingular,
    objectRecordId,
  });

  const inlineFieldMetadataItems = objectMetadataItem.fields
    .filter(
      (fieldMetadataItem) =>
        isFieldCellSupported(fieldMetadataItem, objectMetadataItems) &&
        fieldMetadataItem.id !== labelIdentifierFieldMetadataItem?.id,
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(
      (fieldMetadataItem) =>
        fieldMetadataItem.name !== 'createdAt' &&
        fieldMetadataItem.name !== 'deletedAt',
    )
    .filter(
      (fieldMetadataItem) =>
        fieldMetadataItem.type !== FieldMetadataType.RICH_TEXT_V2,
    )
    .filter(
      (fieldMetadataItem) =>
        fieldMetadataItem.type !== FieldMetadataType.RELATION,
    );

  const isBirthdayEmailEnabledMetadataIndex =
    objectMetadataItem.fields.findIndex(
      (field) => field.name === 'isBirthdayEmailEnabled',
    );

  const birthdayMetadataIndex = inlineFieldMetadataItems.findIndex(
    (field) => field.name === 'birthday',
  );

  const emailMetadaIndex = inlineFieldMetadataItems.findIndex(
    (field) => field.name === 'emails',
  );

  const isBirthdayEmailEnabledMetadataItem =
    objectMetadataItem.fields[isBirthdayEmailEnabledMetadataIndex];

  const birthdayMetadataItem = inlineFieldMetadataItems[birthdayMetadataIndex];

  const emailMetadaItem = inlineFieldMetadataItems[emailMetadaIndex];

  const birthdayFieldDefinition = formatFieldMetadataItemAsColumnDefinition({
    field: birthdayMetadataItem,
    position: birthdayMetadataIndex,
    objectMetadataItem,
    showLabel: true,
    labelWidth: 90,
  });

  const emailFieldDefinition = formatFieldMetadataItemAsColumnDefinition({
    field: emailMetadaItem,
    position: emailMetadaIndex,
    objectMetadataItem,
    showLabel: true,
    labelWidth: 90,
  });

  const isBirthdayEmailEnabledValue = useRecordFieldValue(
    objectRecordId,
    isBirthdayEmailEnabledMetadataItem?.name ?? '',
  );

  const birthdayValue = useRecordFieldValue(
    objectRecordId,
    birthdayFieldDefinition?.metadata?.fieldName ?? '',
  );

  const emailValue = useRecordFieldValue(
    objectRecordId,
    emailFieldDefinition?.metadata?.fieldName ?? '',
  );

  const isBirthdayEmpty = isFieldValueEmpty({
    fieldDefinition: birthdayFieldDefinition,
    fieldValue: birthdayValue,
  });

  const isEmailEmpty = isFieldValueEmpty({
    fieldDefinition: birthdayFieldDefinition,
    fieldValue: emailValue,
  });

  const areFieldsEmpty = isBirthdayEmpty || isEmailEmpty;

  const isRecordReadOnly = useIsRecordReadOnly({
    recordId: objectRecordId,
  });

  return (
    <FieldContext.Provider
      key={objectRecordId + isBirthdayEmailEnabledMetadataItem.id}
      value={{
        maxWidth: 200,
        isLabelIdentifier: false,
        recordId: objectRecordId,
        fieldDefinition: formatFieldMetadataItemAsColumnDefinition({
          field: isBirthdayEmailEnabledMetadataItem,
          position: isBirthdayEmailEnabledMetadataIndex,
          objectMetadataItem,
          showLabel: true,
          labelWidth: 90,
        }),
        useUpdateRecord: useUpdateOneObjectRecordMutation,
        isDisplayModeFixHeight: true,
        isReadOnly: isFieldValueReadOnly({
          objectNameSingular,
          fieldName: isBirthdayEmailEnabledMetadataItem.name,
          fieldType: isBirthdayEmailEnabledMetadataItem.type,
          isCustom: isBirthdayEmailEnabledMetadataItem.isCustom ?? false,
          isRecordReadOnly,
        }),
      }}
    >
      <RecordDetailBirthdaySection
        areFieldsEmpty={areFieldsEmpty}
        isBirthdayEmailEnabledValue={Boolean(isBirthdayEmailEnabledValue)}
      />
    </FieldContext.Provider>
  );
};
