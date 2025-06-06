import { usePersistField } from '@/object-record/record-field/hooks/usePersistField';
import { RecordDetailSection } from '@/object-record/record-show/record-detail-section/components/RecordDetailSection';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

type RecordDetailBirthdaySectionProps = {
  areFieldsEmpty: boolean;
  isBirthdayEmailEnabledValue: boolean;
};

const StyledTitle = styled.div`
  align-items: flex-end;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledTitleLabel = styled.div`
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const RecordDetailBirthdaySection = ({
  areFieldsEmpty,
  isBirthdayEmailEnabledValue,
}: RecordDetailBirthdaySectionProps) => {
  const [enabled, setEnabled] = useState(isBirthdayEmailEnabledValue);

  useEffect(() => {
    setEnabled(isBirthdayEmailEnabledValue);
  }, [isBirthdayEmailEnabledValue]);

  const persistField = usePersistField();

  const handleToggle = () => {
    if (areFieldsEmpty) return;

    const newValue = !enabled;
    setEnabled(newValue);

    try {
      persistField(newValue);
    } catch {
      setEnabled((prev) => !prev);
    }
  };

  return (
    <RecordDetailSection>
      <StyledTitle>
        <StyledTitleLabel>{'Birthday Message Automation'}</StyledTitleLabel>
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggle}
          aria-label="Enable birthday automation"
        />
      </StyledTitle>
    </RecordDetailSection>
  );
};
