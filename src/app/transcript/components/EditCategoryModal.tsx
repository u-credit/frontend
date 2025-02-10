import { CustomSelectOutlined } from '@/components';
import { SelectOption } from '@/types';

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditCategoryModal({
  open,
  onClose,
}: EditCategoryModalProps) {
  if (!open) return null;
  return (
    <div className="flex flex-col bg-white p-5 gap-y-2 lg:gap-y-5 absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px] max-w-5xl max-h-[90vh] w-11/12 h-1/2 overflow-y-auto">
      <div>
        <div>หมวดหมู่เดิม</div>
      </div>
      <div>
        <div>หมวดหมู่ใหม่</div>
        <CustomSelectOutlined
          onSelectedValueChange={function (value: SelectOption): void {
            throw new Error('Function not implemented.');
          }}
          selectOptions={[]}
          selectedValue={{
            label: '',
            value: '',
            children: undefined,
          }}
        />
      </div>
    </div>
  );
}
