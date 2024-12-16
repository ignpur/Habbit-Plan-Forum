# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

# Copy the project file and restore dependencies
COPY HabitPlanForum.Server/*.csproj ./

RUN dotnet restore

# Copy the rest of the application files
COPY HabitPlanForum.Server/*.csproj ./

# Build the project in Release mode
RUN dotnet publish -c Release -o out

# Stage 2: Set up the runtime environment
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App

# Copy the published output from the build stage
COPY --from=build-env /App/out .

# Expose HTTP and HTTPS ports
EXPOSE 5000
EXPOSE 5001

# Run the application
ENTRYPOINT ["dotnet", "HabitPlanForum.Server.dll"]
# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /App

# Copy the project file and restore dependencies
COPY *.csproj ./

RUN dotnet restore

# Copy the rest of the application files
COPY . ./

# Build the project in Release mode
RUN dotnet publish -c Release -o out

# Stage 2: Set up the runtime environment
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App

# Copy the published output from the build stage
COPY --from=build-env /App/out .

# Expose HTTP and HTTPS ports
EXPOSE 5000
EXPOSE 5001

# Run the application
ENTRYPOINT ["dotnet", "HabitPlanForum.Server.dll"]
