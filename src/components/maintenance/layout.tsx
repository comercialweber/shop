import MaintenanceMode from '@/components/maintenance';
import { useSettings } from '@/data/settings';
import {
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
} from '@/lib/constants';
import { eachDayOfInterval, isTomorrow, parseISO, format } from 'date-fns';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from '@/components/ui/loader/spinner/spinner';
import ErrorMessage from '@/components/ui/error-message';
import {
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/data/client/token.utils';

type MaintenanceProps = {
  children: React.ReactNode;
};

export const isInArray = (array: Date[], value: Date) => {
  return !!array?.find((item) => {
    return item?.getDate() == value?.getDate();
  });
};

const Maintenance = ({ children }: MaintenanceProps) => {
  const { settings, isLoading: settingLoading, error } = useSettings();
  const router = useRouter();
  const { locale } = router;
  const [underMaintenanceIsComing, setUnderMaintenanceIsComing] = useAtom(
    checkIsMaintenanceModeComing
  );
  const [underMaintenanceStart, setUnderMaintenanceStart] = useAtom(
    checkIsMaintenanceModeStart
  );

  const { permissions } = getAuthCredentials();
  const AccessAdminRoles = hasAccess(adminOnly, permissions);

  useEffect(() => {
    if (settings?.maintenance?.start && settings?.maintenance?.until) {
      const dateInterVal = eachDayOfInterval({
        start: new Date(settings?.maintenance?.start),
        end: new Date(settings?.maintenance?.until),
      });
      const beforeDay = isTomorrow(
        new Date(settings?.maintenance?.start as string)
      );
      const checkIsMaintenance = beforeDay && settings?.isUnderMaintenance;
      const checkIsMaintenanceStart =
        isInArray(dateInterVal, new Date()) && settings?.isUnderMaintenance;
      setUnderMaintenanceStart(checkIsMaintenanceStart);
      setUnderMaintenanceIsComing(checkIsMaintenance);
    }
  }, [
    settings?.isUnderMaintenance,
    settings?.maintenance?.start,
    settings?.maintenance?.until,
    settingLoading,
    settings,
    locale,
  ]);

  if (settingLoading) {
    return <Spinner />;
  }

  if (error) return <ErrorMessage message={error.message} />;

  if (underMaintenanceStart && !AccessAdminRoles) {
    return <MaintenanceMode />;
  }

  return <>{children}</>;
};

export default Maintenance;
