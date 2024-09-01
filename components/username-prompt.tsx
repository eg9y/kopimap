import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from './catalyst/button';
import { Field, Label } from './catalyst/fieldset';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

type FormValues = {
  username: string;
};

export function UsernamePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    checkUsername();
  }, []);

  const checkUsername = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (error || !data?.username) {
        setIsOpen(true);
      }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, username: data.username });

      if (!error) {
        setIsOpen(false);
      } else {
        console.error('Error updating username:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create a Username</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <Label htmlFor="username">Username</Label>
            <input
              id="username"
              type="text"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 20, message: 'Username must not exceed 20 characters' },
                pattern: {
                  value: /^[a-zA-Z][a-zA-Z0-9_-]*[a-zA-Z0-9]$/,
                  message: 'Username must start with a letter, end with a letter or number, and contain only letters, numbers, underscores, or hyphens'
                }
              })}
              className="w-full p-2 border rounded"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </Field>
          <Button type="submit" color="emerald" className="w-full mt-4">
            Set Username
          </Button>
        </form>
      </div>
    </div>
  );
}
