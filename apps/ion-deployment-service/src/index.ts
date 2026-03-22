/*
    1. Get the build ID from the QUEUE.
    2. Based on the build ID pull the project from the S3.
    3. Build the downloaded project (contanarize it).
    4. The final built output final push to the S3 again (only dist files).
*/

