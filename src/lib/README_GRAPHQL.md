# GraphQL Integration with The Graph

This project integrates with The Graph protocol to fetch blockchain data using GraphQL queries and React Query for state management.

## Setup

1. **Get The Graph Studio Credentials**:
   - Deploy your subgraph to The Graph Studio
   - Get your subgraph URL and auth token from The Graph Studio
   - Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_GRAPH_ENDPOINT=https://api.studio.thegraph.com/query/87766/mevsyou/version/latest
   NEXT_PUBLIC_GRAPH_AUTH_TOKEN=your_bearer_token_here
   ```

## Features

### GraphQL Queries

- `deletedProfiles` - Recently deleted user profiles
- `updatedProfiles` - Recently updated user profiles
- `userCreateds` - New user registrations
- `betCreateds` - New bet creations

### React Query Integration

- Automatic caching and background refetching
- Error handling and retry logic
- Loading states and optimistic updates
- DevTools for debugging

## Usage

### Using Individual Hooks

```typescript
import { useBetCreateds, useUserCreateds } from "@/hooks/useGraphData";

function MyComponent() {
  const { data: bets, isLoading, error } = useBetCreateds(10);
  const { data: users } = useUserCreateds();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {bets?.map((bet) => (
        <div key={bet.id}>{bet.bet_name}</div>
      ))}
    </div>
  );
}
```

### Using Combined Dashboard Data

```typescript
import { useDashboardData } from "@/hooks/useGraphData";

function Dashboard() {
  const { data, isLoading, error } = useDashboardData(5);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Users: {data?.userCreateds.length}</p>
      <p>Bets: {data?.betCreateds.length}</p>
    </div>
  );
}
```

### Using the GraphDashboard Component

```typescript
import { GraphDashboard } from "@/components/GraphDashboard";

function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <GraphDashboard />
    </div>
  );
}
```

## Data Types

### DeletedProfile

- `id`: Unique identifier
- `owner`: Wallet address of profile owner
- `blockNumber`: Block number when deleted
- `blockTimestamp`: Timestamp when deleted

### UpdatedProfile

- `id`: Unique identifier
- `param0`: Update timestamp
- `param1_user`: User address
- `param1_name`: Updated name

### UserCreated

- `id`: Unique identifier
- `user`: Wallet address
- `username`: ENS name or username
- `blockNumber`: Block number when created
- `blockTimestamp`: Timestamp when created

### BetCreated

- `id`: Unique identifier
- `bet_name`: Name of the bet
- `bet_description`: Description of the bet
- `bet_owner`: Address of bet creator
- `bet_status`: Current status
- `bet_result`: Result of the bet
- `bet_betDuration`: Duration in seconds
- `bet_privateBet`: Whether bet is private
- `bet_createdAt`: Creation timestamp
- `bet_updatedAt`: Last update timestamp
- `bet_betType`: Type of bet
- `bet_options`: Available options
- `user`: User address
- `requestId`: Request identifier

## Configuration

### Query Settings

- **Stale Time**: 30 seconds (data considered fresh)
- **Refetch Interval**: 60 seconds (automatic background refetch)
- **Retry Logic**: Up to 3 retries for failed requests
- **Error Handling**: Graceful fallbacks for 4xx errors

### Caching

- Apollo Client handles GraphQL caching
- React Query manages query state and background updates
- Automatic cache invalidation on mutations

## Pages

- `/analytics` - Full analytics dashboard with all data
- Individual hooks can be used in any component

## Error Handling

The integration includes comprehensive error handling:

- Network errors are caught and logged
- Failed queries show retry options
- Loading states provide user feedback
- Graceful degradation when data is unavailable
