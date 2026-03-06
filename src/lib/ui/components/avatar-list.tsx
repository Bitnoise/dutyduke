import { cn, type Nullable } from '@/shared';
import { Avatar } from './avatar';
import { Stack } from './stack';
import { Icon } from './icon';

type Props = {
  users: { name: string; avatarId: Nullable<string> }[];
  visibleCount?: number;
};
export function AvatarList({ users, visibleCount = 6 }: Props) {
  if (!users.length) return <Icon name="avatar-empty" />;

  if (users.length === 1) {
    const [user] = users;

    return (
      <div title={user.name}>
        <Stack className="items-center" gapX="0.5rem">
          <Avatar avatarId={user.avatarId} size="sm" />
          <span className="hidden text-sm xl:inline">{user.name}</span>
        </Stack>
      </div>
    );
  }

  const visibleBatch = users.slice(0, visibleCount);
  const hiddenUsers = users.slice(visibleCount);

  return (
    <Stack gapX="0">
      {visibleBatch.map((user, index) => (
        <div
          key={index}
          className={cn('bg-white rounded-full ring ring-white', {
            '-ml-2': !!index,
          })}
          title={user.name}
        >
          <Avatar key={user.avatarId} avatarId={user.avatarId} size="sm" />
        </div>
      ))}
      {hiddenUsers.length > 0 && (
        <div
          className="-ml-2 flex size-6 items-center justify-center rounded-full bg-green-50 text-[0.5rem] font-semibold text-green-800"
          title={hiddenUsers.map((user) => user.name).join(', ')}
        >
          +{hiddenUsers.length}
        </div>
      )}
    </Stack>
  );
}
