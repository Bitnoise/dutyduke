import Image from 'next/image';

export function DutyDukeLogo(): JSX.Element {
  return (
    <span aria-hidden="true" className="block py-4 text-center">
      <Image
        alt=""
        className="mx-auto h-12 w-auto"
        draggable={false}
        height={48}
        src="/images/logo.svg"
        width={192}
      />
    </span>
  );
}
