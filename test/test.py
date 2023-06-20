# Python program to display all the prime numbers within an interval

n = 1000
numprime = 0

for num in range(2,n):
  # all prime numbers are greater than 1
  if num > 1:
    # when loop finish on prime number them not break 
    for i in range(2, num):
      if (num % i) == 0:
        break
    else:
        numprime+=num

print(numprime)