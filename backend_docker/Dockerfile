# # Step 1: Use the official Python 3.11 image from Docker Hub
# FROM python:3.12

# # Step 2: Set the working directory inside the container
# WORKDIR /app
# COPY requirements.txt /app/



# # Step 4: Install dependencies from requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# # Step 3: Copy the current directory contents into the container
# COPY . /app

# # Step 5: Expose the port the app will run on
# EXPOSE 5000

# # Step 6: Set the command to run the app
# CMD ["python", "main.py"]


# Step 1: Use AWS Lambda Python runtime as the base image
# FROM public.ecr.aws/lambda/python:3.9

# # Step 2: Set the working directory inside the container
# WORKDIR /app

# # Step 3: Copy the requirements file and install dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Step 4: Copy the application code into the container
# COPY . /app

# # Step 5: Set the Lambda handler (modify this based on your app)
# CMD ["main.lambda_handler"]



FROM public.ecr.aws/lambda/python:3.12
WORKDIR ${LAMBDA_TASK_ROOT}
COPY requirements.txt ${LAMBDA_TASK_ROOT}
RUN pip install --no-cache-dir -r requirements.txt
RUN python -m nltk.downloader vader_lexicon punkt stopwords wordnet
COPY . ${LAMBDA_TASK_ROOT}
CMD ["lambda_function.handler"]






