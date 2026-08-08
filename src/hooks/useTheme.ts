import { useAppDispatch, useAppSelector } from './useRedux';
import { toggleTheme } from '@/features/theme';

export default function useTheme() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  return {
    mode,
    toggleTheme: () => dispatch(toggleTheme()),
  };
}
