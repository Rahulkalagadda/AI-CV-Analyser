from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(cv_text: str, job_description: str) -> float:
    """
    Calculate the similarity score between CV text and job description using TF-IDF and cosine similarity.

    Args:
        cv_text (str): The text of the CV.
        job_description (str): The text of the job description.

    Returns:
        float: The similarity score as a percentage.
    """
    # Combine the texts into a list
    documents = [cv_text, job_description]

    # Create a TF-IDF Vectorizer
    vectorizer = TfidfVectorizer()

    # Transform the documents into TF-IDF vectors
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Calculate cosine similarity
    similarity_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])

    # Extract the similarity score and convert it to a percentage
    similarity_score = similarity_matrix[0][0] * 100

    return round(similarity_score, 2)