# 🌱 Plots GraphQL Module

This module contains the complete GraphQL presentation layer for the Plots module, following Clean Architecture and DDD principles.

## 📁 Module Structure

```
graphql/
├── README.md                    # Module documentation
├── plots-graphql.module.ts      # Main GraphQL module
├── plots.graphql                # GraphQL schema definitions
├── resolvers/
│   └── plot.resolver.ts         # Main resolver for plots
├── dtos/
│   ├── requests/                # Input DTOs
│   │   ├── get-plot-by-id.request.dto.ts
│   │   ├── create-plot.request.dto.ts
│   │   ├── update-plot.request.dto.ts
│   │   └── delete-plot.request.dto.ts
│   └── responses/               # Output DTOs
│       └── plot.response.dto.ts
├── mappers/
│   └── plot.mapper.ts           # Mapper between domain and DTOs
├── guards/                      # Authentication/authorization guards
└── subscriptions/               # GraphQL subscriptions (future)
```

## 🔧 Available Operations

### Queries

- `getPlotById`: Gets a specific plot by ID
- `getAllPlots`: Gets all plots for the authenticated user

### Mutations

- `createPlot`: Creates a new plot
- `updatePlot`: Updates an existing plot
- `deletePlot`: Deletes a plot (soft delete)

## 📊 Data Types

### Plot

- `id`: Unique identifier
- `name`: Plot name
- `description`: Optional description
- `dimensions`: Plot dimensions (width, length, height, area, perimeter, volume)
- `status`: Plot status (ACTIVE, INACTIVE, PREPARING, RESTING)
- `soilType`: Soil type
- `soilPh`: Soil pH level
- `farmId`: ID of the farm this plot belongs to
- `createdAt`: Creation date
- `updatedAt`: Last update date
- `deletedAt`: Deletion date (soft delete)

### PlotDimensions

- `width`: Plot width
- `length`: Plot length
- `height`: Plot height
- `area`: Calculated area
- `perimeter`: Calculated perimeter
- `volume`: Calculated volume
- `unitMeasurement`: Unit of measurement (IMPERIAL/METRIC)

## 🔐 Authentication

All operations require JWT authentication. The `JwtAuthGuard` is automatically applied to all resolvers.

## 📝 Usage Examples

### Create a Plot

```graphql
mutation CreatePlot($input: CreatePlotInput!) {
  createPlot(input: $input) {
    id
    name
    description
    dimensions {
      width
      length
      height
      area
      perimeter
      volume
      unitMeasurement
    }
    status
    soilType
    soilPh
    farmId
    createdAt
  }
}
```

### Get Plot by ID

```graphql
query GetPlotById($input: GetPlotByIdInput!) {
  getPlotById(input: $input) {
    id
    name
    description
    dimensions {
      width
      length
      height
      area
      perimeter
      volume
      unitMeasurement
    }
    status
    soilType
    soilPh
    farmId
    createdAt
    updatedAt
  }
}
```

## 🏗️ Architecture

This module follows Clean Architecture principles:

1. **Presenters Layer**: Only handles GraphQL presentation
2. **Dependency Inversion**: Depends on abstractions (queries/commands)
3. **Single Responsibility**: Each class has a specific responsibility
4. **Open/Closed**: Extensible without modifying existing code

## 🔄 Data Flow

1. **GraphQL Query/Mutation** → Resolver
2. **Resolver** → QueryBus/CommandBus
3. **Application Layer** → Domain Layer
4. **Domain Layer** → Infrastructure Layer
5. **Response** → Mapper → GraphQL Response

## 🧪 Testing

Tests should cover:

- Resolvers (unit tests)
- Mappers (unit tests)
- DTOs (validation tests)
- Integration with application layer (integration tests)

## 📚 Dependencies

- `@nestjs/graphql`: GraphQL framework
- `@nestjs/cqrs`: Command Query Responsibility Segregation
- `class-validator`: DTO validation
- `@nestjs/common`: NestJS utilities
