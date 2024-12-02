import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft, IconArrowDownRight } from "@tabler/icons-react";

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import Estimation  from "../../../../../public/images/profile/Revenue-bro.png";
import Image from "next/image";

const YearlyBreakup = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;

  const todayPrice = 35836;
  const yesterdayPrice = 30000;

  const getPercentage = (today: number, yesterday: number) => {
    const res = ((today - yesterday) / yesterday) * 100;
    return res.toFixed(2);
  };

  return (
    <DashboardCard title="Estimated Price">
      <Grid container spacing={3}>
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            ${todayPrice}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            {/* <Avatar
              sx={{ bgcolor: successlight, width: 27, height: 27 }}
            ></Avatar> */}
            {todayPrice > yesterdayPrice ? (
              <>
                <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                  <IconArrowUpLeft width={20} color="#39B69A" />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  {getPercentage(todayPrice, yesterdayPrice)}%
                </Typography>
              </>
            ) : (
              <>
                <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                  <IconArrowDownRight width={20} color="#39B69A" />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  {getPercentage(todayPrice, yesterdayPrice)}
                </Typography>
              </>
            )}
            <Typography variant="subtitle2" color="textSecondary">
              last year
            </Typography>
          </Stack>
        </Grid>
        <Grid>
          <Image src={Estimation} alt="estimation" width={120} height={120}/>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
