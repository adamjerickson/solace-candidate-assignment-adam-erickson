import Image from 'next/image';
import SolaceLogo from '/public/SolaceLogo.svg';

export const SolaceHeader = () => {
  return (
    <div className="flex items-center gap-3 border-b border-green-500 py-4 px-6">
      <Image
        src={SolaceLogo}
        alt="Solace Logo"
        width={120}
        height={32}
        priority
      />
      <span className="text-2xl font-medium text-green-300">Advocate Directory</span>
    </div>
  );
}