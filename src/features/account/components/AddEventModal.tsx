import { useState, type FormEvent } from 'react';
import { CalendarPlus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { toFieldErrors } from '@/features/booking/schemas';
import { todayInBusinessTz } from '@/lib/dates';
import { manualEventInputSchema, type ManualEventInput } from '../schemas';
import { useAddManualEvent } from '../hooks/useAccountData';

const EMPTY = (date: string, vehicle: string): ManualEventInput => ({
  title: '',
  date,
  startTime: '10:00',
  endTime: '11:00',
  vehicle,
  location: '',
  notes: '',
});

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  defaultVehicle: string;
}

/** Personal calendar entry (e.g. "Pick up car", "Tire rotation"). It does not reserve a slot. */
export function AddEventModal({ open, onClose, defaultVehicle }: AddEventModalProps) {
  const addEvent = useAddManualEvent();
  const [form, setForm] = useState(() => EMPTY(todayInBusinessTz(), defaultVehicle));
  const [errors, setErrors] = useState<Partial<Record<keyof ManualEventInput, string>>>({});

  const set = (field: keyof ManualEventInput, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const close = () => {
    addEvent.reset();
    setErrors({});
    setForm(EMPTY(todayInBusinessTz(), defaultVehicle));
    onClose();
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = manualEventInputSchema.safeParse(form);
    if (!parsed.success) return setErrors(toFieldErrors<keyof ManualEventInput>(parsed.error));
    addEvent.mutate(parsed.data, { onSuccess: close });
  };

  return (
    <Modal open={open} onClose={close} labelledBy="add-event-title">
      <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-4 pr-12">
        <div className="p-2 rounded-xl bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
          <CalendarPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 id="add-event-title" className="text-base font-extrabold text-white">
            Add Manual Event
          </h3>
          <p className="text-xs text-zinc-400">A personal reminder on your calendar</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-4">
        <Input
          label="Title *"
          value={form.title}
          error={errors.title}
          placeholder="e.g. Pick up car from service"
          onChange={(e) => set('title', e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Date *"
            type="date"
            value={form.date}
            min={todayInBusinessTz()}
            error={errors.date}
            onChange={(e) => set('date', e.target.value)}
          />
          <Input
            label="Start *"
            type="time"
            value={form.startTime}
            error={errors.startTime}
            onChange={(e) => set('startTime', e.target.value)}
          />
          <Input
            label="End *"
            type="time"
            value={form.endTime}
            error={errors.endTime}
            onChange={(e) => set('endTime', e.target.value)}
          />
        </div>
        <Input
          label="Vehicle"
          value={form.vehicle}
          placeholder="2024 Porsche 911"
          onChange={(e) => set('vehicle', e.target.value)}
        />
        <Input
          label="Location"
          value={form.location}
          placeholder="Address or place"
          onChange={(e) => set('location', e.target.value)}
        />
        <Input
          label="Notes"
          value={form.notes}
          error={errors.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
        {addEvent.error && <p className="text-xs text-rose-400">{addEvent.error.message}</p>}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={close}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-[#3a3a3a] hover:bg-[#4a4a4a] border border-zinc-600 text-white font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addEvent.isPending}
            className="px-5 py-2.5 min-h-11 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs disabled:opacity-50"
          >
            {addEvent.isPending ? 'Saving…' : 'Add to Calendar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
