import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoadingDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6 md:py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* User Stats Card Skeleton */}
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>
                  Your progress in the Starknet ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>

            {/* Recent Badges Card Skeleton */}
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Recent Badges</CardTitle>
                <CardDescription>Your latest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>

            {/* Claimable Items Card Skeleton */}
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Claimable Items</CardTitle>
                <CardDescription>
                  Items available for you to claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
