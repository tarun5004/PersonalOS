import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus, Sparkles } from 'lucide-react';
import { Alert } from '../../../components/ui/Alert.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { resolveAssetImageFormValues } from '../assetFormUtils.js';
import { useGenerateImageAsset } from '../useAssetMutations.js';

const DEFAULT_VALUES = {
  assetType: 'dashboardBackground',
  prompt: '',
};

export function AssetImageForm() {
  const [generatedAsset, setGeneratedAsset] = useState(null);
  const mutation = useGenerateImageAsset();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: resolveAssetImageFormValues,
  });

  function handleValidSubmit(values) {
    mutation.mutate(values, {
      onSuccess: (asset) => {
        setGeneratedAsset(asset);
        reset(DEFAULT_VALUES);
      },
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(handleValidSubmit)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="m-0 text-sm font-bold text-body">AI dashboard background</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Generates server-side, uploads to Cloudinary, and stores the asset on your profile.
          </p>
        </div>
        <Badge variant="muted">Server-side key</Badge>
      </div>

      {mutation.isError ? (
        <Alert variant="error">
          {mutation.error?.message || 'Could not generate image asset.'}
        </Alert>
      ) : null}

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-body">Prompt</span>
        <textarea
          className="min-h-28 w-full resize-y rounded-card border border-border bg-surface px-3.5 py-3 text-body outline-none transition duration-200 placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:shadow-focus aria-[invalid=true]:border-danger"
          placeholder="A calm command-center background for evening planning with subtle teal accents"
          {...register('prompt')}
        />
        {errors.prompt ? <span className="text-sm text-danger">{errors.prompt.message}</span> : null}
      </label>

      <input type="hidden" value="dashboardBackground" {...register('assetType')} />

      <div className="flex flex-wrap justify-end gap-2">
        <Button disabled={mutation.isPending} type="submit">
          <Sparkles aria-hidden="true" size={16} />
          {mutation.isPending ? 'Generating...' : 'Generate asset'}
        </Button>
      </div>

      {generatedAsset ? (
        <div className="rounded-card border border-border bg-surface-elevated p-3">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-card bg-accent-soft text-accent-strong">
              <ImagePlus aria-hidden="true" size={18} />
            </span>
            <div className="min-w-0">
              <p className="m-0 text-sm font-bold text-body">Generated asset saved</p>
              <a
                className="mt-1 block truncate text-xs font-semibold text-accent underline-offset-4 hover:underline"
                href={generatedAsset.url}
                rel="noreferrer"
                target="_blank"
              >
                {generatedAsset.url}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
